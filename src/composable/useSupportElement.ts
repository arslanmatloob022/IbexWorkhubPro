// printUtils.ts
import { useApi } from "/@src/composable/useAPI";
import { useUserSession } from "/@src/stores/userSession";
import axios from "axios";
import { useNotyf } from "/@src/composable/useNotyf";
const api = useApi();
const userSession = useUserSession();
const notyf = useNotyf();

export const DEVICE_BASEURL = "https://api.devices.arez.io/api/";

export const PrintElement = (printableContent: HTMLElement | null) => {
  // Check if the div exists
  if (printableContent) {
    // Open a new window
    const printWindow = window.open("", "_blank");
    // Write the content of the div and copy styles
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print</title>");
      // Copy styles from the original page
      document.head
        .querySelectorAll('style, link[rel="stylesheet"]')
        .forEach((styleElement) => {
          printWindow.document.head.appendChild(styleElement.cloneNode(true));
        });
      printWindow.document.write("</head><body>");
      printWindow.document.write(printableContent.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      // Call print on the new window
      printWindow.print();
    }
  } else {
    console.error("Printable content div not found.");
  }
};

function createCSV(
  array: Array<any>,
  heading: string,
  excludeKeys: Array<any> = []
) {
  var keys = Object.keys(array[0]);

  keys = keys.filter((key) => !excludeKeys.includes(key));
  var result = `** ${heading} ** \n \n \n`; // Bold and increase font size
  result += keys.map((key) => `**${key}**`).join("\t") + "\n ";
  result += "\n";
  array.forEach(function (item: any) {
    keys.forEach(function (key) {
      if (Array.isArray(item[key])) {
        const anomaliesCell = item[key]
          .map((val: any) => `${val.title} (${val.status})`)
          .join(",");
        result += anomaliesCell + ",";
      } else {
        result += item[key] + ",";
      }
    });
    result += "\n";
  });

  return result;
}

export function downloadCSV(
  data: Array<any>,
  filename: string = "data-list",
  excludeKeys: Array<any> = []
) {
  var current = new Date().toLocaleString();
  console.log(current);
  let csv =
    "data:text/csv;charset=utf-8," + createCSV(data, filename, excludeKeys);
  let excel = encodeURI(csv);
  let link = document.createElement("a");
  link.setAttribute("href", excel);
  link.setAttribute("download", `${filename + current}.csv`);
  link.click();
}

interface activityLogs {
  actor?: number;
  object_type?:
    | "worker"
    | "user"
    | "lead"
    | "job"
    | "proposal"
    | "task"
    | "files"
    | "cost_code"
    | "payment";
  action?: "UPDATE" | "CREATE" | "RETRIEVE" | "DELETE";
  message?: string;
  performedOnName?:
    | "supplier"
    | "user"
    | "job"
    | "task"
    | "lead"
    | "payment"
    | "proposal"
    | "costCode";
  object_id?: string;
}

export function CreateActivityLog(options: activityLogs = {}) {
  const {
    actor = userSession.user.id,
    object_type = "ibexUser",
    action = "UPDATE",
    message = "",
    performedOnName = "user",
    object_id = "",
  } = options;
  const payload = {
    actor,
    object_type,
    action,
    message,
    performedOnName,
    object_id,
  };
  try {
    const response = api.post("/api/activity-logs/", payload);
  } catch (err) {
    console.log(err);
  }
}
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timerId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const sendWhatsappMessage = (phoneNum: any) => {
  let phoneNumber = phoneNum;
  if (phoneNumber.slice(0, 2) == "07") {
    phoneNumber = "44" + phoneNumber.slice(1);
  } else if (phoneNumber.slice(0, 3) == "+44") {
    phoneNumber = phoneNumber.slice(1);
  } else if (phoneNumber.slice(0, 1) == "7") {
    phoneNumber = "44" + phoneNumber;
  }
  window.open("https://wa.me/" + phoneNumber.replace(/\s/g), "_blank");
};

export const getAddressComponents = async (zip_code: any) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}&key=AIzaSyDWHedwkLGGa4_3XgPqYxIzMkFpOdKJRik`
    );

    console.log("Full API Response:", response); // Debugging line

    if (!response || !response.data) {
      throw new Error("Invalid API response");
    }

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];
      const lat = result.geometry?.location?.lat ?? null;
      const lng = result.geometry?.location?.lng ?? null;
      const city =
        result.address_components?.find((c: any) =>
          c.types.includes("postal_town")
        )?.long_name ?? "";
      const state =
        result.address_components?.find((c: any) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name ?? "";
      const address = result.formatted_address ?? "";
      return { status: true, data: { city, state, address, lat, lng } };
    } else {
      return { status: false, data: null };
    }
  } catch (err: any) {
    console.error("Error fetching address:", err);
    return { status: false, data: null };
  }
};

export const changeFavicon = (favIcon: any) => {
  const existingLink = document.querySelector('link[rel="icon"]');
  const head = document.head || document.getElementsByTagName("head")[0];

  if (existingLink) {
    head.removeChild(existingLink);
  }
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = favIcon;
  head.appendChild(link);
};

const getUrlExtension = (url: any) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

export const convertUrlToFile = async (imgUrl: any) => {
  var imgExt = getUrlExtension(imgUrl);
  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const file = new File([blob], "profileImage." + imgExt, {
    type: blob.type,
  });
  return file;
};

export function convertToFormData(data: any, fileKeys: any) {
  const formData = new FormData();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          console.log(index);
          formData.append(key, item);
        });
      } else if (
        value !== null &&
        (!fileKeys.includes(key) ||
          (fileKeys.includes(key) && typeof value === "object"))
      ) {
        formData.append(key, value);
      }
    }
  }

  return formData;
}

export const markerColors = ref([
  { id: 1, hexCode: "#FFD700" },
  { id: 3, hexCode: "#98FB98" },
  { id: 4, hexCode: "#FF69B4" },
  { id: 5, hexCode: "#F0E68C" },
  { id: 6, hexCode: "#00CED1" },
  { id: 7, hexCode: "#FFA07A" },
  { id: 9, hexCode: "#FF6347" },
  { id: 10, hexCode: "#00FA9A" },
  { id: 11, hexCode: "#FFE4B5" },
  { id: 12, hexCode: "#40E0D0" },
  { id: 13, hexCode: "#FF8C00" },
  { id: 15, hexCode: "#FF4500" },
  { id: 17, hexCode: "#FF1493" },
  { id: 18, hexCode: "#7FFFD4" },
  { id: 19, hexCode: "#FFB6C1" },
  { id: 20, hexCode: "#00BFFF" },
  { id: 21, hexCode: "#008B8B" },
  { id: 22, hexCode: "#FF00FF" },
  { id: 23, hexCode: "#8B008B" },
  { id: 24, hexCode: "#A52A2A" },
]);

export function formatDate(inputDate: any) {
  const date = new Date(inputDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export function formatDateTime(inputDate: any) {
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) {
    return "";
  }
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatTime(inputDate: any) {
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Use 12-hour format. Change to false for 24-hour format.
  };

  return date.toLocaleTimeString("en-US", options);
}

const getFileUploadingStatus = async (id: any) => {
  try {
    const resp = await api.get(`api/upload-status/${id}/`);
    notyf.green(`res: ${resp.data.state}`);
  } catch (err) {
    console.log(err);
  }
};

export const addOneDayToDate = (dateString: any) => {
  let date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function getReverseGeocodeLocationIQ(query: string) {
  try {
    const resp = await axios.get(
      `https://api.locationiq.com/v1/autocomplete?key=pk.26eb33474e805c6deeea40508e844d84&q=${query}&limit=5&dedupe=1&`
    );
    return resp.data;
  } catch (err) {
    console.error("Error fetching reverse geocode:", err);
    return { status: false, data: null };
  }
}
