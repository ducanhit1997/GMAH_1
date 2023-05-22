﻿using GMAH.Models.Consts;
using GMAH.Models.Models;
using System.Web;

namespace GMAH.Web.Helpers
{
    /// <summary>
    /// Lưu và lấy nhanh session
    /// </summary>
    public class SessionHelper
    {
        public static void SaveSession(string key, object data)
        {
            HttpContext.Current.Session.Add(key, data);
        }

        public static string GetSession(string key)
        {
            if (HttpContext.Current.Session[key] != null)
            {
                return (string)HttpContext.Current.Session[key];
            }
            else
            {
                return null;
            }
        }

        public static T GetSession<T>(string key)
        {
            if (HttpContext.Current.Session[key] != null)
            {
                return (T)HttpContext.Current.Session[key];
            }
            else
            {
                return default(T);
            }
        }

        public static bool IsAdmin()
        {
            var userObj = GetSession<UserIdentity>("USER");
            if (userObj is null) return false;

            return userObj.IdRole == (int)RoleEnum.MANAGER;
        }
    }
}