// LICENSE : MIT
"use strict";
/*
    - engine treat multiple files.
    - engine is wrapped of runner.
 */
import TestRunner from "./reftest-runner"
import Promise from "bluebird"
export default class ReftestEngine {
    constructor() {

    }

    _computeResultOperator(result, compareOperator) {
        // reverser result
        if (compareOperator === "!=") {
            result.passed = !result.passed;
        }
        return result;
    }

    /**
     * run test and return result promise which is filled with array of result.
     * @param {IReftestEngineTarget[]} testTargetList the targetList is defined URL and compareOperator for each test.
     * @returns {Promise.<IReftestCompareResult[]>}
     */
    runTests(testTargetList) {
        var runner = new TestRunner({
            screenshotDirectory: process.cwd() + "/"
        });
        var taskPromiseList = testTargetList.map(function (testTarget) {
            return runner.runTest(testTarget.targetA, testTarget.targetB)
        });
        return Promise.all(taskPromiseList).then((resultList) => {
            return resultList.map((result, index) => {
                var targetItem = testTargetList[index];
                return this._computeResultOperator(result, targetItem.compareOperator);
            })
        });
    }

    getReporter(reporterName) {
        // TODO: implement other reporter
        return require("./reporter/tap-formatter");
    }
}