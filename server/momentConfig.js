import moment from "moment-timezone";

const timeZone = process.env.TIMEZONE || "Asia/Singapore";
moment.tz.setDefault(timeZone);

const momentConfig = {
  getCurrentDateTime: () => moment().format("YYYY-MM-DD HH:mm:ss"),
};

export default momentConfig;
