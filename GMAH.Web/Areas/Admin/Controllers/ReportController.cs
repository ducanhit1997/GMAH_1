using GMAH.Models.Consts;
using GMAH.Services.Services;
using GMAH.Web.Helpers.Attributes;
using System.Web.Mvc;

namespace GMAH.Web.Areas.Admin.Controllers
{
    [RouteArea("Admin", AreaPrefix = "quantri")]
    public class ReportController : Controller
    {
        private SemesterService semesterService;

        public ReportController()
        {
            semesterService = new SemesterService();
        }

        [Route("danhsachbaocao")]
        [JwtAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT, RoleEnum.TEACHER, RoleEnum.HEAD_OF_SUBJECT)]
        public ActionResult Index()
        {
            ViewBag.IdSemester = semesterService.GetCurrentSemesterId();
            return View();
        }

        [Route("duyetbaocao")]
        [JwtAuthentication(RoleEnum.MANAGER, RoleEnum.ASSISTANT, RoleEnum.TEACHER, RoleEnum.HEAD_OF_SUBJECT)]
        public ActionResult Review()
        {
            ViewBag.IdSemester = semesterService.GetCurrentSemesterId();
            return View();
        }

        [Route("xembaocao")]
        [Route("xembaocao/{id}")]
        public ActionResult Info(int? id)
        {
            ViewBag.IdReport = id;
            return View();
        }
    }
}