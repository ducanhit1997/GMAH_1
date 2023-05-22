using System.Collections.Generic;

namespace GMAH.Models.ViewModels
{
    public class ImportParentAndStudentResponse : BaseResponse
    {
        public List<string> UsernameExits { get; set; }
        public List<string> StudentCodeExits { get; set; }

    }
}
