import axios from "axios";

const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

const QUALIFICATION_DETAIL_API =
  "http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList";

  const EXAM_SCHEDULE_API =
  "http://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList";

export const fetchExamSchedules = async () => {
  const res = await axios.get(EXAM_SCHEDULE_API, {
    params: {
      ServiceKey: SERVICE_KEY,
      jmCd: "1320",       
      implYy: "2025",      
      _type: "json",      
    },
  });

  const items = res.data.response.body.items.item;

  return items.map((item) => ({
    implYy: item.implYy,
    implSeq: item.implSeq,
    description: item.description,
    docRegStartDt: item.docRegStartDt,
    docExamStartDt: item.docExamStartDt,
    docPassDt: item.docPassDt,
    pracExamStartDt: item.pracExamStartDt,
    pracPassDt: item.pracPassDt,
  }));
};

export const fetchQualificationDetail = async (jmCd) => {
  const res = await axios.get(QUALIFICATION_DETAIL_API, {
    params: {
      jmCd,
      ServiceKey: SERVICE_KEY,
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