/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-16 11:06:08
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/userManage.ts
 */
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  stringAnyObj,
} from "@/modules/userManage/types";
import {
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "@/modules/userManage/component/searchTable/searchTable";
import { piwigoMethod, post } from "@/utils/api/requests";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { SearchCellStorage } from "../../../userManage/component/searchTable/searchTable";
import { dobuleCheckBtnMaker } from "../../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

export const userManage = async () => {
  const userStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("用户名", "username"),
    tableCellTemplateMaker("注册邮箱", "email"),
    tableCellTemplateMaker("扩展字段", "expand"),
    tableCellTemplateMaker("展示评论", "show_nb_comments"),
    tableCellTemplateMaker("展示评分", "show_nb_hits"),
    tableCellTemplateMaker("高清", "enabled_high"),
    tableCellTemplateMaker("注册时间", "registration_date"),
    tableCellTemplateMaker("上次访问时间", "last_visit"),
    tableCellTemplateMaker("离线时间", "last_visit_since"),
  ]);

  const 查看用户详情 = btnMaker("详情", btnActionTemplate.Function, {
    icon: "InfoFilled",
    type: "info",
    function: async (that, data) => {},
  });

  const 编辑用户详情 = btnMaker("编辑详情", btnActionTemplate.Function, {});

  const 提交创建用户 = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Position",
    elType: "primary",
    function: async (that, data) => {
      if (
        await dobuleCheckBtnMaker(
          "确认新建用户",
          "【" + data.username + "】"
        ).catch(() => false)
      ) {
        let user = useUserStoreHook();
        let options = await user.getOptions();
        const password = "123456user";
        let res = await piwigoMethod({
          method: "pwg.users.add",
          ...data,
          password,
          password_confirm: password,
          pwg_token: options.token,
        });
        let res1 = await piwigoMethod({
          method: "pwg.users.setInfo",
          user_id: res.result.users[0].id,
          status: "admin",
          pwg_token: options.token,
        });
        await dobuleCheckBtnMaker("初始密码：", password);
        repBackMessageShow(that, res);
      }
    },
  });

  const 创建用户 = btnMaker("创建用户", btnActionTemplate.OpenDrawer, {
    icon: "Plus",
    elType: "primary",
    drawerProps: {
      title: "新建用户",
      queryItemTemplate: userStorage.getByKeyArr(["username", "email"]),
      data: { email: "test@11.com" },
      btnList: [提交创建用户],
    },
  });

  const 删除用户 = btnMaker("删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      if (
        await dobuleCheckBtnMaker("删除用户", data.userName).catch(() => false)
      ) {
        let user = useUserStoreHook();
        let options = await user.getOptions();
        let res = await piwigoMethod({
          method: "pwg.users.delete",
          user_id: data.id,
          pwg_token: options.token,
        });
        repBackMessageShow(that, res);
      }
    },
  });

  let user = useUserStoreHook();
  let options = await user.getOptions();
  const 修改密码 = btnMaker("修改密码", btnActionTemplate.Function, {
    icon: "Edit",
    elType: "warning",
    isShow: (data) => {
      return options.status == "webmaster";
    },
    function: async (that, data) => {
      openDrawerFormEasy(that, {
        title: "修改密码",
        queryItemTemplate: [
          tableCellTemplateMaker(
            "新密码",
            "password",
            searchCell(formInputType.password)
          ),
          tableCellTemplateMaker(
            "确认密码",
            "confirm_password",
            searchCell(formInputType.password)
          ),
        ],
        data,
        btnList: [
          btnMaker("确认修改", btnActionTemplate.Function, {
            icon: "Edit",
            elType: "primary",
            function: async (that_confirm, data_confirm) => {
              if (
                await dobuleCheckBtnMaker(
                  "确认修改密码",
                  data.username + "的密码将被修改"
                ).catch(() => false)
              ) {
                let user = useUserStoreHook();
                let options = await user.getOptions();
                let res = await piwigoMethod({
                  method: "pwg.users.setInfo",
                  user_id: data_confirm.id,
                  password: data_confirm.password,
                  pwg_token: options.token,
                });
              }
            },
          }),
        ],
      });
    },
  });

  userStorage.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([删除用户, 修改密码], {
        fixed: "right",
        noDetail: true,
      })
    )
  );

  return [
    gridCellMaker(
      "searchTable",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: userStorage.getByKeyArr([
            "username",
            "email",
            "registration_date",
            "last_visit",
            "last_visit_since",
            "asd",
          ]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await piwigoMethod({
              method: "pwg.users.getList",
              display: "all",
            });
            return res && res.result ? res.result.users : [];
          },
          btnList: [创建用户],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
