import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(result => {
                // Nếu result đã là chuẩn ApiResponse (có success và code), trả về luôn
                if (result && typeof result === 'object' && 'success' in result && 'code' in result) {
                    return result;
                }

                // Mặc định bọc lại đơn giản
                return {
                    code: 0,
                    success: true,
                    message: 'Success',
                    data: result,
                };
            })
        );
    }
}