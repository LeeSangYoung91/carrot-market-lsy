import { FieldErrors, useForm } from "react-hook-form";

// Less code (c)
// Better validation
// Better Erros (set, clear, display)
// Have control over inputs
// Dont deal with events (c)
// Easier Inputs (c)

// register

// register: (name: string, RegisterOptions?) => ({ onChange, onBlur, name, ref })
// 이 메서드를 사용하면 input을 등록하거나 엘리먼트를 선택하고 React Hook Form에 유효성 검사 규칙을 적용할 수 있습니다.
// 유효성 검사 규칙은 모두 HTML 표준을 기반으로 하며 사용자 지정 유효성 검사 방법도 허용합니다.

// register 옵션들
// required: string | { value: boolean, message: string}
// ex) < input {...register("test", {required: 'error message' })}/>
// https://react-hook-form.com/api/useform/register

// handleSubmit
// 이 함수는 form 유효성 검사가 성공하면 form 데이터를 수신합니다.
// ex) < form onSubmit={handleSubmit(onSubmit, onError)} />

// onSubmit (SubmitHandler) (성공적인 콜백)
// (data: Object, e?: Event) => void

// onError (SubmitErrorHandler) (오류 콜백)
// (errors: Object, e?: Event) => void

//handleSubmit은 event.PreventDefault같은걸 하는 함수
//handleSubmit은 2가지 인수를 받는데 첫번째 함수는 너의 form 이 유효할때만 실행되는 함수  두번째는 너의 form이 유효하지 않을때 실행되는 함수

//formState은 erros를 제공
// input에서 입력하는 값을 실시간으로 확인하기 위해서는 watch라는 함수를 사용할 수 있습니다.
interface LoginForm {
    username: string;
    password: string;
    email: string;
}

export default function Forms() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        setValue,
        reset,  //전체초기화
        resetField, //특정필드 초기화  resetField("password");
    } = useForm<LoginForm>({
    //    mode: "onBlur", //내가 input 바깥쪽을 클릭했을 때 이벤트가 일어남 
        mode: "onChange", // 변경할때마다 이벤트
    });
    const onValid = (data: LoginForm) => {
        console.log("im valid bby");
    };
    const onInvalid = (errors: FieldErrors) => {
        console.log(errors);
    };
    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                {...register("username", {
                    required: "이름은 필수사항입니다.",
                    minLength: {
                        message: "The username should be longer than 5 chars.",
                        value: 5,
                    },
                })}
                type='text'
                placeholder='Username'
            />
            {errors.username?.message}
            <input
                {...register("email", {
                    required: "Email is required",
                    validate: {
                        notGmail: (value) =>
                            !value.includes("@gmail.com") ? "" : "gmail안되용",
                    },
                })}
                type='email'
                placeholder='Email'
                className={`${Boolean(errors.email?.message) ? "border-red-500": ''}`}
            />
            {errors.email?.message}
            <input
                {...register("password", { required: "Password is required" })}
                type='password'
                placeholder='Password'
            />
            <input type='submit' value='Create Account' />
        </form>
    );
}
