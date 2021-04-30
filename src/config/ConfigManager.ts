/**
 * AuroraLauncher LauncherServer - Server for AuroraLauncher
 * Copyright (C) 2020 - 2021 AuroraTeam

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as fs from "fs"

import { LogHelper } from "../helpers/LogHelper"
import { StorageHelper } from "../helpers/StorageHelper"
import { LauncherServerConfig } from "./types/LauncherServerConfig"

export class ConfigManager {
    private config: LauncherServerConfig

    constructor() {
        if (fs.existsSync(StorageHelper.configFile)) {
            LogHelper.info("Loading configuration")
            this.load()
        } else {
            LogHelper.info("Configuration not found! Create default config")
            this.config = LauncherServerConfig.getDefaults()
            this.save()
        }
    }

    getConfig(): LauncherServerConfig {
        return this.config
    }

    // Современные проблемы требуют современных решений
    setProp(prop: string, value: string | number | boolean): boolean {
        const propPath = prop.split(".")
        try {
            this.config = this._setProp(propPath, value, this.config)
        } catch (error) {
            LogHelper.error(error)
            return false
        }
        this.save()
        return true
    }

    // Ооо великая рекурсия
    private _setProp(propPath: string[], value: string | number | boolean, config: any): any {
        const chunk = propPath.shift()
        if (config[chunk] === undefined) throw "Prop nf" // TODO Translate
        if (propPath.length === 0) {
            config[chunk] = value
            return config
        }
        this._setProp(propPath, value, config[chunk])
    }

    private load(): void {
        const config = fs.readFileSync(StorageHelper.configFile).toString()
        try {
            this.config = LauncherServerConfig.fromJSON(config)
        } catch (e) {
            if (e instanceof SyntaxError) {
                LogHelper.error(e)
                LogHelper.fatal("Json syntax broken. Try fix or delete LauncherServerConfig.json")
            }
            LogHelper.fatal(e)
        }
    }

    private save(): void {
        fs.writeFileSync(StorageHelper.configFile, this.config.toJSON())
    }
}