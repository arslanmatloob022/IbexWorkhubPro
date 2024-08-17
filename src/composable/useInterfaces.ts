import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";
import axios from "axios";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const userSession = useUserSession();
const notyf = useNotyf();

export interface WorkerQuestionsInterface {
  id: Number;
  title: String;
  type: String;
  correctAnswer: String;
  questionFor: String;
  created_at: String;
  arezCompany: Number;
  industry: Number;
}


export interface TimeSheetInterFace {

    timeSheetID: number;
    created_at: string;
    worker_id: number;
    bookOnTime: string;
    bookOffTime: string;
    bookOnLat: string;
    bookOnLong: string;
    bookOnLocation: string;
    bookOffLat: string;
    bookOffLong: string;
    bookOffLocation: string;
    hoursWorked: string;
    bookOnImageURL: string;
    bookOffImageURL: string;
    isBookOnImageVerified: boolean;
    isBookOffImageVerified: boolean;

}
