import request from '@/utils/requerts'

export function login(data) {
    return request.service({
        url: 'user/login',
        method: 'POST',
        data,
    })
}

export function getUserList(params) {
    return request.service({
        url: 'user/selectUserName',
        method: 'GET',
        params,
    })
}

export function setProject(data) {
    return request.service({
        url: 'items/terrace/addOneItem',
        method: 'POST',
        data,
    })
}

export function getMyProjectList(data) {
    return request.service({
        url: 'items/terrace/selectAll',
        method: 'POST',
        data,
    })
}

export function getMyProjectDetails(params) {
    return request.service({
        url: 'items/terrace/getById',
        method: 'GET',
        params,
    })
}

export function releaseProject(params) {
    return request.service({
        url: 'items/terrace/isState',
        method: 'GET',
        params,
    })
}

export function getUserProjectList(params) {
    return request.service({
        url: '/itemsUser/list',
        method: 'GET',
        params

    })
}

export function delFile(params) {
    return request.service({
        url: '/sys/file/del',
        method: 'DELETE',
        params,
    })
}

export function joinProject(data) {
    return request.service({
        url: 'itemsUser/join/joinItems',
        method: 'POST',
        data,
    })
}



export function register(data) {
    return request.service({
        url: 'user/insert',
        method: 'POST',
        data,
    })
}

export function sureCollection(params) {
    return request.service({
        url: 'itemsUser/iuToaccount',
        method: 'GET',
        params,
    })
}

export function getLendingData(data) {
    return request.service({
        url: 'itemsRate/getListByTime',
        method: 'POST',
        data,
    })
}

export function sureLending(data) {
    return request.service({
        url: 'itemsRate/remit',
        method: 'POST',
        data,
    })
}

export function submitBankInfo(data) {
    return request.service({
        url: 'userBank/insert',
        method: 'POST',
        data,
    })
}

export function getUserCon(data) {
    return request.service({
        url: '/user/listFuzzy',
        method: 'POST',
        data,
    })
}

export function getUserInfo(params) {
    return request.service({
        url: 'itemsRate/getListByid',
        method: 'GET',
        params,
    })
}

export function getBankInfo(params) {
    return request.service({
        url: 'userBank/getMyBank',
        method: 'GET',
        params,
    })
}

export function getUserBankInfo(params) {
    return request.service({
        url: 'itemsBank/getCompanyBank',
        method: 'GET',
        params,
    })
}

export function resetPassword(params) {
    return request.service({
        url: 'user/resetPassword',
        method: 'GET',
        params,
    })
}


export function getUserDetail(params) {
    return request.service({
        url: 'user/getLoginUserInfo',
        method: 'GET',
        params,
    })
}

export function updatePassword(params) {
    return request.service({
        url: 'user/updatePassword',
        method: 'GET',
        params,
    })
}

export function recallProject(params) {
    return request.service({
        url: 'items/terrace/recall',
        method: 'GET',
        params,
    })
}

export function replaceUser(data) {
    return request.service({
        url: 'itemsUser/itemsReplaceUser',
        method: 'POST',
        data,
    })
}

/**
 * 拉去关注用户信息
 * @param params
 * @returns {AxiosPromise}
 */
export function vxUserGetuserAll(params) {
    return request.service({
        url: 'vxUser/getuserAll',
        method: 'GET',
        params,
    })
}

/**
 * 获取微信列表
 * @param params
 * @returns {AxiosPromise}
 */
export function vxUserGetAll(params) {
    return request.service({
        url: 'vxUser/getAll',
        method: 'GET',
        params,
    })
}

/**
 * 修改微信用户信息
 * @param params
 * @returns {AxiosPromise}
 */
export function updateByOpenId(data) {
    return request.service({
        url: 'vxUser/updateByOpenId',
        method: 'POST',
        data,
    })
}

export function delUser(params) {
    return request.service({
        url: 'user/delete',
        method: 'DELETE',
        params,
    })
}

export function getCharts(params) {
    return request.service({
        url: 'itemsRate/statistics',
        method: 'GET',
        params,
    })
}
export function selectFuzzyOfYear(params) {
    return request.service({
        url: 'items/terrace/selectFuzzyOfYear',
        method: 'GET',
        params,
    })
}

export function itemsUserDetails(params) {
    return request.service({
        url: 'itemsUser/itemsUserDetails',
        method: 'GET',
        params,
    })
}

export function selectUserNoInItem(params) {
    return request.service({
        url: 'user/selectUserNoInItem',
        method: 'GET',
        params,
    })
}



export function deleteProject(params) {
    return request.service({
        url: '/items/delete',
        method: 'DELETE',
        params,
    })
}

export function getUserStatistics(params) {
    return request.service({
        url: 'items/user/statistics',
        method: 'GET',
        params,
    })
}

export function getByUserYears(params) {
    return request.service({
        url: 'items/getByUserYears',
        method: 'GET',
        params,
    })
}




