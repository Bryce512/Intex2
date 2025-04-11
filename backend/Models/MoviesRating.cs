using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace intex2.Models;

public partial class MoviesRating
{
    
    public int? UserId { get; set; }

    public string? ShowId { get; set; }

    public int? Rating { get; set; }
}
