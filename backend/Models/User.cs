using System;
using System.Collections.Generic;

namespace intex2.Models;

public partial class User
{
    public int UserId { get; set; }

    public required string Username { get; set; } = null!;

    public required string Password { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }
}
