﻿using GMAH.Services.Services;
using GMAH.Web.Helpers.Attributes;
using System.Web.Mvc;
using System.Web.Routing;

namespace GMAH.Web.Areas.Student.Controllers
{
    [RouteArea("Student", AreaPrefix = "")]
    [JwtAuthentication]
    public class ReportController : Controller
    {
        private SemesterService semesterService;

        public ReportController()
        {
            semesterService = new SemesterService();
        }

        [Route("baocao")]
        public ActionResult Index()
        {
            ViewBag.IdSemester = semesterService.GetCurrentSemesterId();
            return View();
        }

        [Route("taobaocao")]
        public ActionResult Create()
        {
            ViewBag.IdSemester = (new SemesterService()).GetCurrentSemesterId() ?? -1;
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