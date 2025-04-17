import axios from "axios";

const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

const EXAM_SCHEDULE_API =
  "https://api.odcloud.kr/api/15074408/v1/uddi:2cabcbd5-9b61-49b6-9463-fc193c682848";

const QUALIFICATION_DETAIL_API =
  "http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList";

export const fetchExamSchedules = async () => {
  const res = await axios.get(EXAM_SCHEDULE_API, {
    params: {
      page: 1,
      perPage: 100,
      serviceKey: decodeURIComponent(SERVICE_KEY),
    },
  });
  return res.data.data;
};

export const fetchQualificationDetail = async (jmCd) => {
  const res = await axios.get(QUALIFICATION_DETAIL_API, {
    params: {
      jmCd,
      ServiceKey: decodeURIComponent(SERVICE_KEY),
    },
    responseType: "text",
  });

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(res.data, "text/xml");

  const item = xmlDoc.querySelector("item");
  const jmfldnm = item?.querySelector("jmfldnm")?.textContent;
  const infogb = item?.querySelector("infogb")?.textContent;
  const contents = item?.querySelector("contents")?.textContent;

  return {
    jmfldnm,
    infogb,
    contents,
  };
};