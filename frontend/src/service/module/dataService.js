/*
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-20 19:23:35
 * @LastEditTime: 2022-12-14 18:14:34
 */

import axios from 'axios';

// axios.defaults.withCredentials = true
const TEST_URL_PREFIX = 'http://127.0.0.1:5000/api/test';

export function fetchHello(param, callback) {
    const url = `${TEST_URL_PREFIX}/hello/`;
    axios.post(url, param)
        .then(response => {
            callback(response.data)
        }, errResponse => {
            console.log(errResponse)
        })
}

export function fetchAllData(param, callback) {
    const url = `${TEST_URL_PREFIX}/fetchAllData/`;
    axios.post(url, param)
        .then(response => {
            callback(response.data)
        }, errResponse => {
            console.log(errResponse)
        })
}

export function fetchMigration(param, callback) {
    const url = `${TEST_URL_PREFIX}/fetchMigration/`;
    axios.post(url, param)
        .then(response => {
            callback(response.data)
        }, errResponse => {
            console.log(errResponse)
        })
}

export function saveNetworkData(param, callback) {
    const url = `${TEST_URL_PREFIX}/saveNetwork/`;
    axios.post(url, param)
    .then(response => {
        callback(response.data);
    }, errResponse => {
        console.log(errResponse);
    })
}
