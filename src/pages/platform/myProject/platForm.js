

import util from '@/utils/utils'
export default {
    projectListColumns: [
        {
            align: "center",
            title: "项目名称",
            minWidth: 130,
            key: "iitemname"
        },
        {
            align: "center",
            title: "项目状态",
            key: "iitemstate",
            sortable: "custom",
            width: 95,
            render: (h, params) => {
                switch (params.row.iitemstate) {
                    case 0:
                        return h("span", "未发布");
                    case 1:
                        return h("span", "进行中");
                    case 2:
                        return h("span", "已完结");
                    case 3:
                        return h("span", "已撤回");
                }
            }
        },
        {
            align: "center",
            title: "需要筹资金额",
            key: "igatheringmoney",
            width: 120,
            render: (h, params) => {
                return h(
                    "span",
                    util.digitalConversion(params.row.igatheringmoney)
                );
            }
        },
        {
            align: "center",
            title: "项目开始-结束时间",
            key: "ibegintime",
            sortable: "custom",
            width: 190,
            render: (h, params) => {
                return h("span", params.row.ibegintime + "/" + params.row.iendtime);
            }
        },

        {
            align: "center",
            title: "项目最后交款日期",
            width: 135,
            key: "iitemlastdate"
        },
        {
            align: "center",
            title: "项目期数",
            width: 80,
            key: "iitemperiodsday",
            render: (h, params) => {
                return h(
                    "span",
                    params.row.iitemperiodsType == 0
                        ? params.row.iitemperiods + "/" + params.row.iitemperiodsday
                        : params.row.iitemperiods
                );
            }
        },
        {
            align: "center",
            title: "项目周期",
            width: 80,
            key: "iitemperiodsday",
            render: (h, params) => {
                return h("span", params.row.iitemperiodsType == 0 ? "日" : "月");
            }
        },
        {
            align: "center",
            title: "参与/已打款/已确认(人数)",
            width: 190,
            key: "irate",
            render: (h, params) => {
                return h(
                    "span",
                    params.row.itemsUsers.length +
                    "/" +
                    params.row.iuJoinintentionSum +
                    "/" +
                    params.row.iuToaccountSum
                );
            }
        },
        {
            align: "center",
            title: "项目利率(%)",
            width: 100,
            key: "irate"
        },
        {
            align: "center",
            title: "操作",
            slot: "action",
            width: 190,
            align: "center"
        }
    ]

}
