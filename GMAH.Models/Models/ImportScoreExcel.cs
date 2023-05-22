using System;
using System.Collections.Generic;

namespace GMAH.Models.Models
{
    public class ImportScoreExcel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string SubjectCode { get; set; }
        public List<ImportScoreStudentDetail> Student { get; set; }
    }

    public class ImportScoreStudentDetail
    {
        public string StudentCode { get; set; }
        public string StudentName { get; set; }
        public double? Score { get; set; }
        public int IdScoreType { get; set; }
        public string ScoreName { get; set; }
        public string Note { get; set; }
    }

    public class ImportStudentsParentsExcel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string SubjectCode { get; set; }

        public List<StudentAndParentModel> StudentAndParentModels { get; set; }
    }

    public class ImportScoreTypeExcel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string SubjectCode { get; set; }

        public List<ScoreTypeModel> ScoreTypeModels { get; set; }
    }

    public class StudentAndParentModel
    {
        public string MSSV { get; set; }
        public string StudentUserName { get; set; }
        public string StudentName { get; set; }
        public string TeacherName { get; set; }
        public string StudentAddress { get; set; }
        public string StudentEmail { get; set; }
        public string StudentCCCD { get; set; }
        public DateTime StudentBirthday { get; set; }
        public string StudentPhoneNumber { get; set; }
        public string ParentUserName { get; set; }
        public string ParentName { get; set; }
        public string ParentCCCD { get; set; }
        public string ParentEmail { get; set; }
        public string ParentPhoneNumber { get; set; }
        public string ParentAddress { get; set; }
        public List<int> IdParents { get; set; }
        public List<int> IdChilds { get; set; }
    }

    public class ScoreTypeModel
    {
        public string FieldStudy { get; set; }
        public string Subject { get; set; }
        public string ScoreName { get; set; }
        public string ScoreWeight { get; set; }
    }
    public class ParentModel
    {
        public string UserName { get; set; }
        public string ParentName { get; set; }
        public string CCCD { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string StudentCode { get; set; }

    }

    public class ImportTeacherExcel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string SubjectCode { get; set; }

        public List<TeacherModel> TeacherModels { get; set; }
    }
    public class TeacherModel
    {
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }

        public string Name { get; set; }
        public string CCCD { get; set; }
        public string TeacherCode { get; set; }

    }
}
