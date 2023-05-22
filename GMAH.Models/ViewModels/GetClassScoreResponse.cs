using System.Collections.Generic;

namespace GMAH.Models.ViewModels
{
    public class GetClassScoreResponse : BaseResponse
    {
        public int? IdSemester { get; set; }
        public int IdYear { get; set; }
        public string FileName { get; set; }
        public string ClassName { get; set; }

        public List<ScoreComponentViewModel> ScoreComponent { get; set; }
    }
}
