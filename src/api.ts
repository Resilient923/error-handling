import axios, { AxiosError } from "axios";

const baseUrl = "https://mock.codes";

export const getApi1 = async () => {
  return await axios.get(`${baseUrl}/400`);
};

export const getApi2 = async () => {
  /**
   * Expected
   * - 서버가 200을 반환했다면 : return { resp.data: MockCodeResponse }
   * - 서버가 400을 반환했다면 : throw { throw new Error(status:400) }
   * - 서버가 죽었다면 : throw { throw new Error(status:500) }
   * 실제
   * - 서버가 200을 반환했다면 : 정상
   * - 서버가 400을 반환했다면 : AxiosError is thrown.
   * - 서버가 죽었다면 : AxiosError is thrown.
   */

  console.log("getApi2 called");
  const resp = await axios.get(`${baseUrl}asdf/400`); // MockCodeResponse
  if (resp.status !== 200) {
    console.log(`getApi2 status error : ${resp.status}`);
    throw new Error();
  }
  console.log(`success, returning ${resp.data}`);
  return resp.data;
};

class BadRequestError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

const handleAndThrowError = (e: any) => {
  if (e instanceof AxiosError && e.response?.status === 400) {
    throw new BadRequestError(e.response?.data.description);
  } else {
    throw e;
  }
};

export const getApi3 = async () => {
  // try-catch
  /**
   * Expected
   * - 서버가 200을 반환했다면 : return { resp.data: MockCodeResponse }
   * - 서버가 400을 반환했다면 : (서버가 의미있는 에러메세지를 줬을 것이므로) throw { new BadRequest(message:xx) }
   * - 서버가 죽었다면 : throw { given AxiosError }
   * 함의
   * - 이 함수를 쓰는 너는, (1) 200과 400은 로직을 구현해서 핸들링하고 (2) 500이나 기타에러는 거의 발생안할테니(혹은 발생했다면 에러트래킹을할테니) 신경쓰지마
   * 실제
   * - 서버가 200을 반환했다면 : 정상
   * - 서버가 400을 반환했다면 : 정상
   * - 서버가 죽었다면 : 정상
   * 평가
   * - 장점
   *   - 스탠다드다. 개발자에게 올바른 방법이다. (=학교에서 배운 방법이다.)
   * - 단점
   *   - BadRequestError 를 throw하네요. (디자인에서부터 애초에) try catch 를 강요한 거에요.
   *   - typescript는 "there's only one catch"이기 때문에, catch를 하는 코드를 쓰기가 지저분해요.
   */
  console.log("getApi3 called");
  try {
    const resp = await axios.get(`${baseUrl}/500`);
    console.log("got resp:");
    console.log(resp);
    return resp.data;
  } catch (e: any) {
    // ^ = axios에 의한 오류를 캐치하기 위한 try-catch에요.

    // . = "e를 보고, (1) e가 bad request를 뜻하면 BadRequestError를 쏘고, (2) 아니면 e를 쏘고"
    // if (e instanceof AxiosError && e.response?.status === 400) {
    //   throw new BadRequestError(e.response?.data.description);
    // } else {
    //   throw e;
    // }

    // (x)
    // return await handleAndThrowError(e);    // return하지 않아요
    // (x)
    // handleError(e);    // 얘가 Throw를 하는지 불분명해요
    // (o)
    handleAndThrowError(e);
  }
};

export const myClient = axios.create({
  baseURL: "https://mock.codes",
  validateStatus: (code) => {
    console.log("validateStatus called");
    if (200 <= code && code < 300) return true;
    if (code == 400) return true;
    return false;
  },
});

/**
 * type ApiResponse<T> {
 *   success: boolean,
 *   data?: T,
 *   errorMessage?: str,
 * }
 */

export const getApi4 = async () => {
  // x : {param => ApiResponse<MockCodeResponse> } () => {}
  // modify axios
  /**
   * Expected
   * - 서버가 200을 반환했다면 : return { success: true, data: "resp.data: MockCodeResponse", errorMessage: null }
   * - 서버가 400을 반환했다면 : return { success: false, data: null, errorMessage: str }
   * - 서버가 죽었다면 : throw { given AxiosError }
   * 실제
   * - 서버가 200을 반환했다면 :
   * - 서버가 400을 반환했다면 :
   * - 서버가 죽었다면 :
   * 평가
   * -
   */
  console.log("getApi4 called");
  const resp = await myClient.get(`${baseUrl}asdf/500`); // 이게 400이더라도 throw를 안함.

  // // bad version
  // if (resp.status !== 200) {
  //   console.log(`getApi2 status error : ${resp.status}`);
  //   if (resp.status == 400) {   // if문 안에 if문이 들어가 있어서,
  //     return { success: false, description: resp.data.message };
  //   }
  // }
  // // != 400 일 때 도달하는 곳
  // console.log(`success, returning ${resp.data}`);
  // return resp.data;

  // better version
  if (resp.status == 400) {
    // if문 안에 if문이 들어가 있어서,
    return {
      success: false,
      description: resp?.data?.message || "some message",
    };
  } else if (resp.status !== 200) {
    // cannot happen... but anyway...
    console.log(`getApi4 status error : ${resp.status}`);
  }
  console.log(`success, returning ${resp.data}`);
  // return resp.data;  // 문제가 있어요. 심각해요. caller는 내 요청이 성공했는지 실패했는지 어떻게 알죠?
  return { success: true, data: resp.data };
};

// 차원이 2개인데
// (1) 구현시 try를 쓰냐 마냐 (안쓰려면 axios.create 가 필요함)
// (2) 리턴시 wrapping을 하냐 마나
// (3)

export const getApi5 = async () => {
  /**
   * Expected
   * - 서버가 200을 반환했다면 : return { success: true, data: MockCodeResponse }
   * - 서버가 400을 반환했다면 : return { success: false, message: ~ }
   * - 서버가 죽었다면 : return { success: false, mesage: ~ }
   * 실제
   * 평가
   * - 장점
   *   - 갖다 쓰는 사람 입장에서, 엄청 편하다.
   * - 단점
   *   - wrapping이 되어있다. 근데 이게 단점인가?
   *   - 개발철학은 한두개 무시했을지 몰라도, 코드가독성 측면에서는 넘사벽으로 좋다.
   */
  console.log("getApi5 called");
  try {
    const resp = await axios.get(`${baseUrl}asdf/500`); // MockCodeResponse
    return { success: true, data: resp.data };
  } catch (e: any) {
    console.log("error occured");
    console.log(e);
    const message =
      e.response?.data?.description ||
      `Unknown: ${e.message}` ||
      "Unknown error";
    return { success: false, message: message };
  }
};
