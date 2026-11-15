var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Client chỉ phục vụ giao diện và địa chỉ API công khai.
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/client-config", () => Results.Ok(new
{
    apiBaseUrl = builder.Configuration["Api:BaseUrl"]
        ?? throw new InvalidOperationException("Thieu cau hinh Api:BaseUrl.")
}));

app.Run();
