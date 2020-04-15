export interface ICalendar {
    id: string;
    name: string;
    accessRole: AccessRole;
}

export interface IInputItem {
    cal: ICalendar;
    regex: string;
    exclude: boolean;
}

type AccessRole = "reader" | "owner" | "freeBusyReader" | "writer";

export interface ISetting {
    inputItems: IInputItem[];
    outputCal?: ICalendar;
    startDate: string;
    endDate: string;
}