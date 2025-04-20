import axios from "axios";

const API_KEY = process.env.REACT_APP_SERVICE_KEY;

const BASE_URL =
  "https://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList";

  export const fetchExamEvents = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          serviceKey: API_KEY,
          dataFormat: "json",
          pageNo: 1,
          numOfRows: 100,
          implYy: 2024,       // 시행년도
          qualgbCd: "T",      // 자격구분코드: 국가기술자격
          jmCd: "7910",       // 종목코드: 한식조리기능사
        },
      });
  
      console.log("📦 API 응답 전체:", response.data); // ✅ 추가
      const items = response.data.body?.items || [];   // ❗ 안전하게 처리
      console.log("📋 추출된 items:", items);
  
      const events = items.map((item) => ({
        title: `${item.description} (${item.implSeq}회)`,
        start: item.docExamStartDt,
        end: item.docExamEndDt,
        allDay: true,
      }));
  
      return events;
    } catch (error) {
      console.error("시험일정 데이터를 불러오는 중 오류 발생:", error);
      return [];
    }
  };