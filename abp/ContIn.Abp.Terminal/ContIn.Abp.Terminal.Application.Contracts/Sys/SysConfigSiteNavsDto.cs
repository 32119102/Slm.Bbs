﻿namespace ContIn.Abp.Terminal.Application.Contracts.Sys
{
    /// <summary>
    /// 导航配置
    /// </summary>
    public class SysConfigSiteNavsDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string? Title { get; set; }
        /// <summary>
        /// 链接
        /// </summary>
        public string? Url { get; set; }
    }
}
