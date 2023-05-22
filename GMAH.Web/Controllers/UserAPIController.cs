using GMAH.Models.Consts;
using GMAH.Models.Models;
using GMAH.Models.ViewModels;
using GMAH.Services.Services;
using GMAH.Web.Helpers;
using GMAH.Web.Helpers.Attributes;
using System.Collections.Generic;
using System.IO;
using System;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Net;


namespace GMAH.Web.Controllers
{
    public class UserAPIController : ApiController
    {
        private UserService userService;

        public UserAPIController()
        {
            userService = new UserService();
        }

        /// <summary>
        /// Đăng nhập bằng api
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public LoginResponse Login(LoginRequest data)
        {
            var loginService = new LoginService();
            return loginService.LoginGetToken(data.Username, data.Password, new JWTHelper());
        }

        /// <summary>
        /// Lưu người dùng
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpPost]
        public SaveUserInfoResponse SaveUser(SaveUserInfoRequest data)
        {
            // Kiểm tra role đủ quyền hạn không
            var userClaims = RequestContext.Principal as ClaimsPrincipal;
            var userRole = int.Parse(userClaims.FindFirst(x => x.Type == "IdRole").Value);

            if (userRole > data.IdRole)
            {
                return new SaveUserInfoResponse
                {
                    IsSuccess = false,
                    Message = "Bạn không có quyền thực hiện tác vụ với người dùng này",
                };
            }

            // Lưu người dùng
            return userService.SaveUser(data);
        }

        /// <summary>
        /// Quản lý tài khoản quản trị
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER)]
        [HttpPost]
        public PaginationResponse GetListAdministrator(DatatableParam param)
        {
            var result = userService.PaginationUserByRole(new RoleEnum[] { RoleEnum.MANAGER, RoleEnum.ASSISTANT }, param);
            return result;
        }

        /// <summary>
        /// Quản lý tài khoản giáo viên
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpPost]
        public PaginationResponse GetListTeacher(DatatableParam param)
        {
            var result = userService.PaginationUserByRole(new RoleEnum[] { RoleEnum.TEACHER, RoleEnum.HEAD_OF_SUBJECT }, param);
            return result;
        }

        /// <summary>
        /// Quản lý tài khoản học sinh
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpPost]
        public PaginationResponse GetListStudent(DatatableParam param)
        {
            var result = userService.PaginationUserByRole(new RoleEnum[] { RoleEnum.STUDENT }, param);
            return result;
        }

        /// <summary>
        /// Quản lý tài khoản phụ huynh
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpPost]
        public PaginationResponse GetListParent(DatatableParam param)
        {
            var result = userService.PaginationUserByRole(new RoleEnum[] { RoleEnum.PARENT }, param);
            return result;
        }

        /// <summary>
        /// Tác vụ quản lý chung
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpGet]
        public BaseResponse GetUser(int id)
        {
            return userService.GetUserById(id);
        }

        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        [HttpDelete]
        public BaseResponse DeleteUser(int id)
        {
            // Check user's role
            var userInfo = userService.GetUserById(id);
            if (!userInfo.IsSuccess)
            {
                return userInfo;
            }    

            // Kiểm tra role đủ quyền hạn không
            var userClaims = RequestContext.Principal as ClaimsPrincipal;
            var userRole = int.Parse(userClaims.FindFirst(x => x.Type == "IdRole").Value);
            var userId = int.Parse(userClaims.FindFirst(x => x.Type == "IdUser").Value);

            if (userRole > (int)userInfo.Object.IdRole || userId == (int)userInfo.Object.IdUser)
            {
                return new BaseResponse
                {
                    IsSuccess = false,
                    Message = "Bạn không có quyền xoá người dùng này",
                };
            }    


            return userService.DeleteUserById(id);
        }

        /// <summary>
        /// Lấy danh sách giáo viên
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllTeacher()
        {
            var listTeacher = userService.GetUsersViewModelByRole(new RoleEnum[] { RoleEnum.TEACHER, RoleEnum.HEAD_OF_SUBJECT });
            return new BaseResponse
            {
                IsSuccess = true,
                Object = listTeacher,
            };
        }

        /// <summary>
        /// Lấy danh sách BANG
        /// </summary>
        /// <param></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllYear()
        {
            var data = userService.GetAllYear();
            return new BaseResponse
            {
                IsSuccess = true,
                Object = data
            };
        }

        /// <summary>
        /// Lấy danh sách BANG
        /// </summary>
        /// <param></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllFieldStudy()
        {
            var data = userService.GetAllFieldStudy();
            return new BaseResponse
            {
                IsSuccess = true,
                Object = data
            };
        }

        /// <summary>
        /// Lấy danh sách Môn
        /// </summary>
        /// <param></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllSubject()
        {
            var data = userService.GetAllSubject();
            return new BaseResponse
            {
                IsSuccess = true,
                Object = data
            };
        }

        /// <summary>
        /// Lấy danh sách Môn
        /// </summary>
        /// <param></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetListStudyFieldByYear(int id)
        {
            var data = userService.GetListStudyFieldByYear(id);
            return new BaseResponse
            {
                IsSuccess = true,
                Object = data
            };
        }

        /// <summary>
        /// Lấy danh sách học sinh
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllStudent()
        {
            var listStudent = userService.GetUsersViewModelByRole(new RoleEnum[] { RoleEnum.STUDENT });
            return new BaseResponse
            {
                IsSuccess = true,
                Object = listStudent,
            };
        }

        /// <summary>
        /// Lấy danh sách phụ huynh
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse GetAllParent()
        {
            var listParent = userService.GetUsersViewModelByRole(new RoleEnum[] { RoleEnum.PARENT });
            return new BaseResponse
            {
                IsSuccess = true,
                Object = listParent,
            };
        }

        /// <summary>
        /// Tạo password ngẫu nhiên và gửi mail
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        public BaseResponse SendMailPassword(int id)
        {
            return userService.SendMailPassword(id);
        }

        /// <summary>
        /// Cập nhật thông tin
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        [ApiAuthentication]
        public BaseResponse UpdateInfo(UpdateInfoRequest data)
        {
            var userClaims = RequestContext.Principal as ClaimsPrincipal;
            int idUser = int.Parse(userClaims.FindFirst(x => x.Type == "IdUser").Value);
            data.IdUser = idUser;

            return userService.UpdateInfo(data);
        }

        /// <summary>
        /// Cập nhật mật khẩu
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        [ApiAuthentication]
        public BaseResponse UpdatePassword(UpdatePasswordRequest data)
        {
            var userClaims = RequestContext.Principal as ClaimsPrincipal;
            int idUser = int.Parse(userClaims.FindFirst(x => x.Type == "IdUser").Value);
            data.IdUser = idUser;

            return userService.UpdatePassword(data);
        }

        /// <summary>
        /// Lấy info
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpGet]
        [ApiAuthentication]
        public BaseResponse ViewInfo()
        {
            var userClaims = RequestContext.Principal as ClaimsPrincipal;
            int idUser = int.Parse(userClaims.FindFirst(x => x.Type == "IdUser").Value);

            return userService.GetUserById(idUser);
        }
        private ImportParentAndStudentResponse SaveParentAndStudent(List<StudentAndParentModel> studentAndParentModels)
        {
            var lstUsernameExits = new List<string>();
            var lstStudentCodeExits = new List<string>();
            foreach (var i in studentAndParentModels)
            {
                var studentUser = new SaveUserInfoRequest
                {
                    // role: 4-gv, 5-PH, 6-HS
                    IdRole = 6,
                    Fullname = i.StudentName,
                    Phone = i.StudentPhoneNumber,
                    Address = i.StudentAddress,
                    Password = "1", // defautl password
                    Repassword = "1", // defautl password
                    Username = i.StudentUserName,
                    Email = i.StudentEmail,
                    StudentCode = i.MSSV,
                };

                var parentUser = new SaveUserInfoRequest
                {
                    // role: 4-gv, 5-PH, 6-HS
                    IdRole = 5,
                    Fullname = i.ParentName,
                    Phone = i.ParentPhoneNumber,
                    Address = i.ParentAddress,
                    Password = "1", // defautl password
                    Repassword = "1", // defautl password
                    Username = i.ParentUserName,
                    Email = i.ParentEmail,
                    StudentCode = i.MSSV
                };
                var res = userService.SaveParentAndStudent(studentUser, parentUser);
                lstUsernameExits = res.UsernameExits;
                lstStudentCodeExits = res.StudentCodeExits;
                if (!res.IsSuccess)
                {
                    return new ImportParentAndStudentResponse
                    {
                        IsSuccess = false,
                        Message = res.Message
                    };
                }
            }

            return new ImportParentAndStudentResponse
            {
                IsSuccess = true,
                UsernameExits = lstUsernameExits,
                StudentCodeExits = lstStudentCodeExits
            };
        }

        [HttpPost]
        //[ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        public ImportParentAndStudentResponse ImportStudentFromExcel()
        {
            // Kiểm tra file
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count != 1)
            {
                return new ImportParentAndStudentResponse
                {
                    IsSuccess = false,
                    Message = "Không tìm thấy file excel"
                };
            }

            // Trích xuất file
            var excelFile = httpRequest.Files[0];
            var folderPath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp");
            Directory.CreateDirectory(folderPath);
            var filePath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp/temp_" + DateTime.Now.ToFileTimeUtc() + ".xlsx");
            excelFile.SaveAs(filePath);

            // Đọc file excel 
            var dataFromExcel = ExcelHelper.ReadInforStudentParentFromExcel(filePath);
            if (!dataFromExcel.IsSuccess)
            {
                return new ImportParentAndStudentResponse
                {
                    IsSuccess = false,
                    Message = "Không tìm thấy file excel"
                };
            }

            var result = SaveParentAndStudent(dataFromExcel.StudentAndParentModels);
            return result;
        }

        [HttpPost]
        //[ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        public ImportParentAndStudentResponse ImportParentFromExcel()
        {
            // Kiểm tra file
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count != 1)
            {
                return new ImportParentAndStudentResponse
                {
                    IsSuccess = false,
                    Message = "Không tìm thấy file excel"
                };
            }

            // Trích xuất file
            var excelFile = httpRequest.Files[0];
            var folderPath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp");
            Directory.CreateDirectory(folderPath);
            var filePath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp/temp_" + DateTime.Now.ToFileTimeUtc() + ".xlsx");
            excelFile.SaveAs(filePath);

            // Đọc file excel 
            var dataFromExcel = ExcelHelper.ReadInforStudentParentFromExcel(filePath);
            if (!dataFromExcel.IsSuccess)
            {
                return new ImportParentAndStudentResponse
                {
                    IsSuccess = false,
                    Message = "Lỗi xử lý file excel"
                };
            }

            var result = SaveParentAndStudent(dataFromExcel.StudentAndParentModels);
            return result;
        }

        private ImportTeacherResponse SaveTeacher(List<TeacherModel> teacherModels)
        {
            var lstUsernameExits = new List<string>();
            var lstTeacherCodeExits = new List<String>();
            foreach (var i in teacherModels)
            {
                var teacherUser = new SaveUserInfoRequest
                {
                    // role: 4-gv, 5-PH, 6-HS
                    IdRole = 4,
                    Fullname = i.Name,
                    Phone = i.PhoneNumber,
                    Password = "1", // defautl password
                    Repassword = "1", // defautl password
                    Username = i.UserName,
                    Email = i.Email,
                    TeacherCode = i.TeacherCode
                };

                var res = userService.SaveTeacher(teacherUser);
                lstUsernameExits = res.UsernameExits;
                lstTeacherCodeExits = res.TeacherCodeExits;
                if (!res.IsSuccess)
                {
                    return new ImportTeacherResponse
                    {
                        IsSuccess = false,
                        Message = res.Message
                    };
                }
            }

            return new ImportTeacherResponse
            {
                IsSuccess = true,
                UsernameExits = lstUsernameExits,
                TeacherCodeExits = lstTeacherCodeExits
            };
        }


        [HttpPost]
        //[ApiAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT)]
        public ImportTeacherResponse ImportTeacherFromExcel()
        {
            // Kiểm tra file
            // Kiểm tra file
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count != 1)
            {
                return new ImportTeacherResponse
                {
                    IsSuccess = false,
                    Message = "Không tìm thấy file excel"
                };
            }

            // Trích xuất file
            var excelFile = httpRequest.Files[0];
            var folderPath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp");
            Directory.CreateDirectory(folderPath);
            var filePath = HttpContext.Current.Server.MapPath("~/Assests/UploadTemp/temp_" + DateTime.Now.ToFileTimeUtc() + ".xlsx");
            excelFile.SaveAs(filePath);

            // Đọc file excel 
            var dataFromExcel = ExcelHelper.ReadInforTeacherFromExcel(filePath);
            if (!dataFromExcel.IsSuccess)
            {
                return new ImportTeacherResponse
                {
                    IsSuccess = false,
                    Message = "Lỗi xử lý file excel"
                };
            }

            var result = SaveTeacher(dataFromExcel.TeacherModels);
            return result;
        }
    }
}
