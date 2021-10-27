import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'
var DynamicRoute = function (routePath) {
    this.routeList = [];
    this.requireRoutePath = routePath;
    this.axios = axios;
}

DynamicRoute.prototype.generateRoute = () => {
    this.getRouteInfo().then(res => {
        console.log(res);
    }).catch(error => {
        throw error;
    });

    console.log(routeData)
}

DynamicRoute.prototype.getRouteInfo = async () => {
    try {
        let returnData = await this.axios.get(this.requireRoutePath);
        this.handleAndCreate(returnData);
    } catch (error) {
        throw new Error(error.toString())
    }
}

DynamicRoute.prototype.handleAndCreate = (routeData) => {
    
}