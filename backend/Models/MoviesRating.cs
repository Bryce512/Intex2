using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace intex2.Models;

public partial class MoviesRating
{
    [Key]

    public int? UserId { get; set; }

    [Key]

    public string? ShowId { get; set; }

    public int? Rating { get; set; }
}
