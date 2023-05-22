using System.ComponentModel.DataAnnotations;

namespace GMAH.Models.ViewModels
{
    public class ChangeChildInfoRequest
    {
        public int IdChild { get; set; }
        public int IdParent { get; set; }


        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng email")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Vui lòng nhập đúng định dạng điện thoại")]
        [MaxLength(10, ErrorMessage = "Số điện thoại tối đa 10 ký tự")]
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}
