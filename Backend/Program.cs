using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Data;
using KargoSecimAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL'in tarih formatıyla ilgili bir ayar yapmam gerekiyor
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Veritabanı bağlantısını kuruyorum
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Kargo ve yapay zeka servislerimi ekliyorum
builder.Services.AddScoped<IKargoService, KargoService>();
builder.Services.AddScoped<IAIService, AIService>();

// Frontend'in backend'e erişebilmesi için CORS ayarı yapıyorum
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS middleware'ını diğerlerinden önce eklemem lazım
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Backend'i 5000 portunda başlatıyorum
app.Run("http://localhost:5000");
