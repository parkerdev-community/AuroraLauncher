import {
    InstancesManager,
    LangManager,
    ProfilesManager,
} from "@root/components";
import { AbstractCommand, Category } from "@root/utils";
import { injectable } from "tsyringe";

@injectable()
export class SyncAllCommand extends AbstractCommand {
    constructor(
        langManager: LangManager,
        private readonly profilesManager: ProfilesManager,
        private readonly instancesManager: InstancesManager
    ) {
        super({
            name: "syncall",
            description:
                langManager.getTranslate.CommandsManager.commands.updates
                    .SyncAllCommand,
            category: Category.UPDATES,
        });
    }

    invoke(): void {
        this.profilesManager.reloadProfiles();
        this.instancesManager.hashInstancesDir("instances");
    }
}
