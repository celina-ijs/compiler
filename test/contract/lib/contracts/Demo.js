"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const Demo_json_1 = __importDefault(require("./Demo.json"));
class Demo extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, Demo_json_1.default.abi, Demo_json_1.default.bytecode);
        this.assign();
    }
    deploy(options) {
        return this.__deploy([], options);
    }
    parseApprovalEvent(receipt) {
        return this.parseEvents(receipt, "Approval").map(e => this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event) {
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new eth_contract_1.BigNumber(result.value),
            _event: event
        };
    }
    parseTransferEvent(receipt) {
        return this.parseEvents(receipt, "Transfer").map(e => this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event) {
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new eth_contract_1.BigNumber(result.value),
            _event: event
        };
    }
    assign() {
        let allowanceParams = (params) => [params.owner, params.spender];
        let allowance_call = async (params, options) => {
            let result = await this.call('allowance', allowanceParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.allowance = allowance_call;
        let balanceOf_call = async (account, options) => {
            let result = await this.call('balanceOf', [account], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.balanceOf = balanceOf_call;
        let decimals_call = async (options) => {
            let result = await this.call('decimals', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.decimals = decimals_call;
        let name_call = async (options) => {
            let result = await this.call('name', [], options);
            return result;
        };
        this.name = name_call;
        let symbol_call = async (options) => {
            let result = await this.call('symbol', [], options);
            return result;
        };
        this.symbol = symbol_call;
        let totalSupply_call = async (options) => {
            let result = await this.call('totalSupply', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.totalSupply = totalSupply_call;
        let approveParams = (params) => [params.spender, this.wallet.utils.toString(params.amount)];
        let approve_send = async (params, options) => {
            let result = await this.send('approve', approveParams(params), options);
            return result;
        };
        let approve_call = async (params, options) => {
            let result = await this.call('approve', approveParams(params), options);
            return result;
        };
        this.approve = Object.assign(approve_send, {
            call: approve_call
        });
        let decreaseAllowanceParams = (params) => [params.spender, this.wallet.utils.toString(params.subtractedValue)];
        let decreaseAllowance_send = async (params, options) => {
            let result = await this.send('decreaseAllowance', decreaseAllowanceParams(params), options);
            return result;
        };
        let decreaseAllowance_call = async (params, options) => {
            let result = await this.call('decreaseAllowance', decreaseAllowanceParams(params), options);
            return result;
        };
        this.decreaseAllowance = Object.assign(decreaseAllowance_send, {
            call: decreaseAllowance_call
        });
        let increaseAllowanceParams = (params) => [params.spender, this.wallet.utils.toString(params.addedValue)];
        let increaseAllowance_send = async (params, options) => {
            let result = await this.send('increaseAllowance', increaseAllowanceParams(params), options);
            return result;
        };
        let increaseAllowance_call = async (params, options) => {
            let result = await this.call('increaseAllowance', increaseAllowanceParams(params), options);
            return result;
        };
        this.increaseAllowance = Object.assign(increaseAllowance_send, {
            call: increaseAllowance_call
        });
        let mint_send = async (amount, options) => {
            let result = await this.send('mint', [this.wallet.utils.toString(amount)], options);
            return result;
        };
        let mint_call = async (amount, options) => {
            let result = await this.call('mint', [this.wallet.utils.toString(amount)], options);
            return;
        };
        this.mint = Object.assign(mint_send, {
            call: mint_call
        });
        let transferParams = (params) => [params.to, this.wallet.utils.toString(params.amount)];
        let transfer_send = async (params, options) => {
            let result = await this.send('transfer', transferParams(params), options);
            return result;
        };
        let transfer_call = async (params, options) => {
            let result = await this.call('transfer', transferParams(params), options);
            return result;
        };
        this.transfer = Object.assign(transfer_send, {
            call: transfer_call
        });
        let transferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.amount)];
        let transferFrom_send = async (params, options) => {
            let result = await this.send('transferFrom', transferFromParams(params), options);
            return result;
        };
        let transferFrom_call = async (params, options) => {
            let result = await this.call('transferFrom', transferFromParams(params), options);
            return result;
        };
        this.transferFrom = Object.assign(transferFrom_send, {
            call: transferFrom_call
        });
    }
}
Demo._abi = Demo_json_1.default.abi;
exports.Demo = Demo;
