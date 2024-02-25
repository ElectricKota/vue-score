type Settings = {
    lang: string,
    rowSize: number;
    gameSize: number;
    numberOfPlayers: number;
    gameType: number;
};

export class GlobalSettings {
    public settings: Settings = {//tady proměnné nastavení včetně defaultních hodnot
        lang: 'cz',
        rowSize: 8,
        gameSize: 64,
        numberOfPlayers: 4,
        gameType: 0
    }
    private static LANGUAGES_AVIABLE = ['CZ', 'EN', 'cz', 'en'];
    private static GAMES_AVIABLE = ['NUMBERS', 'WORDS', 'PICTURES'];

    constructor() {
        this.loadSavedData();
    }
    private loadSavedData() {
        //*tady se načtou data z localu
    }

    public setLang(language: string): boolean {
        let test = false;
        //ověří zda existuje požadovaný jazyk
        GlobalSettings.LANGUAGES_AVIABLE.forEach(type => {
            if (type === language) { test = true }
        });
        if (test) {//pokud ano nastaví ho
            this.settings.lang = language;
            return true;
        }
        return false;
    }

    public getLang(): string {
        return this.settings.lang;
    }
    public getInactiveLang(): string {
        let disabled = "N/A";
        GlobalSettings.LANGUAGES_AVIABLE.forEach(type => {
            if (type !== this.settings.lang) { disabled = type }
        });
        return disabled;
    }
    public toggleLang() {
        if (this.settings.lang === 'cz' || this.settings.lang === 'CZ') this.settings.lang = 'en';
        else this.settings.lang = 'cz';
    }
}

type Players = {
    name: string;
    date: string;
    gameSize: number;
    points: number;
    round: number;
    sessions: number;
};

export class players {
    public players = [<Players>{
        name: 'Jakub',
        date: 'Dneska',
        gameSize: 4,
        points: 150,
        round: 15,
        sessions: 0
    }, {
        name: 'Michal',
        date: 'Dneska',
        gameSize: 4,
        points: 100,
        round: 14,
        sessions: 0
    }, {
        name: 'Lenka',
        date: 'Dneska',
        gameSize: 4,
        points: 105,
        round: 13,
        sessions: 0
    }, {
        name: 'Tomáš',
        date: 'Dneska',
        gameSize: 4,
        points: 64,
        round: 13,
        sessions: 0
    },

    ]
}
