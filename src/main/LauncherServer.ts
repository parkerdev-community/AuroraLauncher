require("source-map-support").install()

import * as colors from "colors/safe"

import { AuthManager } from "./auth/AuthManager"
import { CommandsManager } from "./commands/CommandsManager"
import { ConfigManager } from "./config/ConfigManager"
import { LogHelper } from "./helpers/LogHelper"
import { StorageHelper } from "./helpers/StorageHelper"
import { VersionHelper } from "./helpers/VersionHelper"
import { MirrorManager } from "./mirror/MirrorManager"
import { ModulesManager } from "./modules/ModulesManager"
import { SocketManager } from "./requests/SocketManager"
import { UpdatesManager } from "./updates/UpdatesManager"

export class LauncherServer {
    private _ConfigManager: ConfigManager
    private _AuthManager: AuthManager
    private _CommandsManager: CommandsManager
    private _MirrorManager: MirrorManager
    private _ModulesManager: ModulesManager
    private _SocketManager: SocketManager
    private _UpdatesManager: UpdatesManager

    get ConfigManager(): ConfigManager {
        return this._ConfigManager;
    }

    get AuthManager(): AuthManager {
        return this._AuthManager;
    }

    get CommandsManager(): CommandsManager {
        return this._CommandsManager;
    }

    get MirrorManager(): MirrorManager {
        return this._MirrorManager;
    }

    get ModulesManager(): ModulesManager {
        return this._ModulesManager;
    }

    get SocketManager(): SocketManager {
        return this._SocketManager;
    }

    get UpdatesManager(): UpdatesManager {
        return this._UpdatesManager;
    }

    main(): void {
        LogHelper.raw(
            colors.bold(
                colors.cyan("AuroraLauncher ") +
                    colors.green("LauncherServer ") +
                    "v" +
                    colors.yellow(`${VersionHelper.getVersion()} `) +
                    colors.blue("https://gitlab.com/aurorateam")
            )
        )
        LogHelper.raw(colors.bold(colors.green("Documentation page ") + colors.blue("https://aurora-launcher.ru/wiki")))
        StorageHelper.createMissing()
        LogHelper.info("Initialization start")
        this._ConfigManager = new ConfigManager()
        this._AuthManager = new AuthManager()
        this._CommandsManager = new CommandsManager()
        this._MirrorManager = new MirrorManager()
        this._ModulesManager = new ModulesManager()
        this._SocketManager = new SocketManager()
        this._UpdatesManager = new UpdatesManager()
        LogHelper.info("Initialization end")
        this.ModulesManager.emit("postInit")
    }
}

export const App = new LauncherServer()
App.main()
