﻿namespace GMAH.Models.ViewModels
{
    public class PaginationResponse
    {
        public int draw { get; set; }
        public int recordsTotal { get; set; }
        public int recordsFiltered { get; set; }
        public object data { get; set; }
    }
}
