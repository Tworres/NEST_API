import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// captura os dados do usuário com base na autenticação
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    //captura os dados da requisição htpp (header e body)
    const request = ctx.switchToHttp().getRequest();

    if (data) {
      // se foi definido um parametro ele vai tentar encontrar uma propiedade com o nome deste parametro
      return request.user[data];
    } else {
      // se não foi definido um parametro ele retorna o usuário inteiro
      return request.user;
    }
  },
);
