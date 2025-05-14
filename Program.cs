using System;
using System.Text;
using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.Entities;
using ElectronicGadgetsAPI.Hubs;
using ElectronicGadgetsAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;  // 4.1. Added as part of JWT authentication

// Add services to the container.

//14.Register signalR
builder.Services.AddSignalR();

builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();

// 1.Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("db")));

// 2. Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// 3. Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>  // 4. Adding Jwt Bearer
{
         options.SaveToken = true;
         options.RequireHttpsMetadata = false;
         options.TokenValidationParameters = new TokenValidationParameters()
         {
             ValidateIssuer = true,
             ValidateAudience = true,
             ValidAudience = configuration["JWT:ValidAudience"],
             ValidIssuer = configuration["JWT:ValidIssuer"],
             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
         };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for the Hub endpoint
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/chathub")) // Make sure this matches your MapHub path
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});


// 9. registering authentication
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

//14.Registering messaging
builder.Services.AddScoped<IChatRepository, ChatRepository>();

// 10. Register CreateAdminUserService
builder.Services.AddScoped<CreateAdminUserService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();


// 5. Swagger authentication
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Wedding Planner API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});


// 6. Add CORS policy
builder.Services.AddCors((coreoptions) =>
{
    coreoptions.AddPolicy("MyPolicy", (policyoptions) =>
    {
        policyoptions
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:4200"); // replace with your frontend URL
    });
});

//11.For password hashing.
builder.Services.AddScoped<IPasswordHelper, PasswordHelper>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 12. Role handling
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await IdentityDataSeeder.CreateRoles(services);
    // Create Admin user if not exists
    var createAdminService = services.GetRequiredService<CreateAdminUserService>();
    await createAdminService.CreateAdminUserAsync(); // This will create the admin user
}

//10. For images handling in static files
app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = ""
});

app.UseRouting();
// 7. adding cors middleware

app.UseCors("MyPolicy");

app.UseHttpsRedirection();

// 8. add Authentication

app.UseAuthentication();

app.UseAuthorization();

//13.realtime chat
app.MapHub<ChatHub>("/chathub");

app.MapControllers();

app.Run();
