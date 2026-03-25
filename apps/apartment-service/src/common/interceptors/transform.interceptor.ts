import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(result => {
                // Check if result is already an ApiResponse
                if (result && result.data && result.data.metaDate) {
                    return {
                        code: 0,
                        success: true,
                        message: 'Success',
                        data: result.data,
                        metaDate: result.data.metaDate,
                    };
                }
                // Mặc đinh bọc lại đơn giản
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