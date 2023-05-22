using System.Collections.Generic;

namespace GMAH.Models.ViewModels
{
    public class ImportTeacherResponse : BaseResponse
    {
        public List<string> UsernameExits { get; set; }
        public List<string> TeacherCodeExits { get; set; }

    }
}
