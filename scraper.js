const axios = require("axios").default;
const cheerio = require("cheerio");

const _normalize = (str) => {
  return str.replace(/,/g, "");
};

const _normalizeDot = (str) => {
  return str.replace(/\./g, "").replace(/,/g, ".");
};

const _strPad = (str, maxLen, fillStr) => {
  return String(str).padStart(maxLen ?? 2, fillStr ?? "0");
};

const stamp = () => {
  const dt = new Date();
  const Y = dt.getFullYear();
  const m = _strPad(dt.getMonth() + 1);
  const d = _strPad(dt.getDate());
  const H = _strPad(dt.getHours());
  const i = _strPad(dt.getMinutes());
  const s = _strPad(dt.getSeconds());
  return `${Y}-${m}-${d} ${H}:${i}:${s}`;
};

/**
 * Bank Indonesia (BI)
 */
const getBI = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(
        "https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx"
      )
      .then((resp) => {
        if (resp.status == 200) {
          let dataset = [];
          const $ = cheerio.load(resp.data);
          const rows = $("table").last().find("tbody > tr");
          rows.each((i, row) => {
            dataset.push({
              currency: $(row).find("td:nth-child(1)").text().trim(),
              buy: parseFloat(
                _normalizeDot($(row).find("td:nth-child(4)").text())
              ),
              sell: parseFloat(
                _normalizeDot($(row).find("td:nth-child(3)").text())
              ),
            });
          });

          resolve({
            bank: "BI - Bank Indonesia",
            timestamp: stamp(),
            data: dataset,
          });
        } else {
          resolve({ msg: "Failed to crawl BI data", status: "failed" });
        }
      })
      .catch((err) => {
        reject({ msg: err.message, status: "failed" });
      });
  });
};

/**
 * Bank Central Asia (BCA)
 */
const getBCA = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get("https://www.bca.co.id/id/informasi/kurs")
      .then((resp) => {
        if (resp.status == 200) {
          let dataset = [];
          const $ = cheerio.load(resp.data);
          const rows = $("table").last().find("tbody > tr");
          rows.each((i, row) => {
            dataset.push({
              currency: $(row).find("td:nth-child(1)").text().trim(),
              buy: parseFloat(
                _normalizeDot($(row).find("td:nth-child(2) p").text())
              ),
              sell: parseFloat(
                _normalizeDot($(row).find("td:nth-child(3) p").text())
              ),
            });
          });

          resolve({
            bank: "BCA - Bank Central Asia",
            timestamp: stamp(),
            data: dataset,
          });
        } else {
          resolve({ msg: "Failed to crawl BCA data", status: "failed" });
        }
      })
      .catch((err) => {
        reject({ msg: err.message, status: "failed" });
      });
  });
};

module.exports = {
  stamp,
  getBI,
  getBCA,
};