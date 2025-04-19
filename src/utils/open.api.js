import axios from "axios";

const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

// 국가기술자격 목록 API
const QUALIFICATION_LIST_API =
  "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualificationSVC/getList";

// 국가기술자격 상세정보 API
const QUALIFICATION_DETAIL_API =
  "http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList";

export const fetchQualificationList = async () => {
  const res = await axios.get(QUALIFICATION_LIST_API, {
    params: {
      ServiceKey: SERVICE_KEY,
    },
    responseType: "text",
  });

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(res.data, "text/xml");
  const items = xmlDoc.querySelectorAll("item");

  return Array.from(items).map((item) => ({
    jmCd: item.querySelector("jmCd")?.textContent || "",
    jmfldnm: item.querySelector("jmfldnm")?.textContent || "",
  }));
};

export const fetchQualificationDetail = async (jmCd) => {
  const res = await axios.get(QUALIFICATION_DETAIL_API, {
    params: {
      ServiceKey: SERVICE_KEY,
      jmCd,
    },
    responseType: "text",
  });

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(res.data, "text/xml");
  const item = xmlDoc.querySelector("item");

  return {
    jmfldnm: item?.querySelector("jmfldnm")?.textContent ?? "",
    contents: item?.querySelector("contents")?.textContent ?? "",
    docpassPoint: item?.querySelector("docpassPoint")?.textContent ?? "",
    pracpassPoint: item?.querySelector("pracpassPoint")?.textContent ?? "",
    docsubject: item?.querySelector("docsubject")?.textContent ?? "",
    pracsubject: item?.querySelector("pracsubject")?.textContent ?? "",
    aptitude: item?.querySelector("aptitude")?.textContent ?? "",
  };
};