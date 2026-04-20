import dayjs from "dayjs";

type RuleCheck = (value: string) => string | null;

export const runSequentialRules = (value: string, rules: RuleCheck[]) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return Promise.reject(new Error(error));
  }
  return Promise.resolve();
};

export const rulesCheck = {
  required: (label: string): RuleCheck => v =>
    !v ? `Vui lòng nhập ${label.toLowerCase()}!` : null,

  noSpace: (): RuleCheck => v =>
    v && v.trimStart() !== v ? 'Không được để khoảng trắng ở đầu!' : null,

  max: (label: string, count: number): RuleCheck => v =>
    v && v.length > count ? `${label} không được vượt quá ${count} ký tự!` : null,

  noNumber: (msg: string): RuleCheck => v =>
    /\d/.test(v) ? msg : null,

  noSpecial: (msg: string): RuleCheck => v =>
    !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\s]*$/.test(v)
      ? msg
      : null,

  isPhone: (msg: string): RuleCheck => v => {
    if (!v) return null;
    const phoneRegex = /^[\+\d\s]{1,20}$/;
    return phoneRegex.test(v) ? null : msg;
  },

  // ngày tháng
  isValidDate: (msg: string): RuleCheck => v => {
    if (!v) return null;
    return dayjs(v).isValid() ? null : msg;
  },

  //  validate số âm
  noNegative: (msg: string): RuleCheck => v =>
    v && Number(v) < 0 ? msg : null,
  //  chỉ đc nhập số bao gồm số thập phân 
  isNumeric: (msg: string): RuleCheck => v => {
    if (!v) return null;
    return !/^\d*\.?\d*$/.test(v.toString()) ? msg : null;
  },

  // Validate định dạng CCCD (12 số)
  isCCCD: (msg: string): RuleCheck => v => {
    if (!v) return null;
    return /^\d{12}$/.test(v) ? null : msg;
  },

  isTaxCode: (msg: string): RuleCheck => v => {
    if (!v) return null;
    const taxCodeRegex = /^(\d{10}|\d{10}-\d{3})$/;
    return taxCodeRegex.test(v) ? null : msg;
  },

  isTaxOrBusinessCode: (): RuleCheck => v => {
    if (!v) return null;
    const regex = /^[0-9-]{1,14}$/;
    return regex.test(v) ? null : "Tối đa 14 ký tự gồm số và dấu gạch ngang";
  },

  isMaToChuc: (msg: string): RuleCheck => v => {
    if (!v) return null;
    // Regex \s kiểm tra bất kỳ ký tự khoảng trắng nào
    return /\s/.test(v) ? msg : null;
  },

  isEmail: (msg: string): RuleCheck => v => {
    if (!v) return null;

    // Regex đủ dùng cho 99% case thực tế
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(v) ? null : msg;
  },

  isAtLeast18Years: (msg: string): RuleCheck => v => {
    if (!v) return null;

    const date = dayjs(v);
    if (!date.isValid()) return msg;

    const minDate = dayjs().subtract(18, "year");

    return date.isAfter(minDate, "day") ? msg : null;
  },

  //  chặn 3 lần cách liên tiếp
  noTripleSpace: (msg: string): RuleCheck => v =>
    v && /\s{3,}/.test(v) ? msg : null,


  noFutureDate: (msg: string): RuleCheck => v => {
    if (!v) return null;
    return dayjs(v).isAfter(dayjs(), 'day') ? msg : null;
  },
  isCodeFormat: (): RuleCheck => v =>
    !/^[a-zA-Z0-9\-_]*$/.test(v)
      ? "Mã chỉ được chứa chữ không dấu, số và ký tự - _"
      : null,
};

export const validateRules = {
  name: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        // rulesCheck.noNumber(`${label} không được chứa số!`),
        // rulesCheck.noSpecial(`${label} không được chứa ký tự đặc biệt!`),
        rulesCheck.noSpace(),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.max(label, 255),
      ]),
  }),

  nameVB: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        // rulesCheck.required(label),
        // rulesCheck.noNumber(`${label} không được chứa số!`),
        // rulesCheck.noSpecial(`${label} không được chứa ký tự đặc biệt!`),
        rulesCheck.noSpace(),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.max(label, 255),
      ]),
  }),

  ma: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        // rulesCheck.noNumber(`${label} không được chứa số!`),
        // rulesCheck.noSpecial(`${label} không được chứa ký tự đặc biệt!`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
        rulesCheck.max(label, 50),
      ]),
  }),

  maToChuc: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        rulesCheck.isMaToChuc(`${label} không được chứa khoảng trắng!`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.max(label, 50),
      ]),
  }),

  soDangKyKinhDoanh: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        rulesCheck.isTaxOrBusinessCode(),
      ]),
  }),

  maCode: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        rulesCheck.noSpace(), // Nếu không muốn khoảng trắng ở đầu/cuối
        rulesCheck.isCodeFormat(),
        rulesCheck.max(label, 50),
      ]),
  }),

  tenOther: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
        rulesCheck.max(label, 100),
      ]),
  }),

  number: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue = (value !== undefined && value !== null) ? String(value) : "";

      return runSequentialRules(stringValue, [
        rulesCheck.required(label),
        // rulesCheck.noNegative(`${label} không được là số âm!`), 
        rulesCheck.isNumeric(`${label} phải là chữ số!`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
        rulesCheck.max(label, 30),
      ]);
    }
  }),
  // Rule chỉ kiểm tra định dạng ngày tháng
  date: (label: string) => ({
    validator: (_: any, value: any) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        rulesCheck.noFutureDate(`${label} không được là ngày trong tương lai!`),
        rulesCheck.isValidDate(`${label} không đúng định dạng ngày tháng!`),
      ]),
  }),
  phone: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue = (value !== undefined && value !== null) ? String(value) : "";
      return runSequentialRules(stringValue, [
        // rulesCheck.required(label),
        rulesCheck.isPhone(`${label} không đúng định dạng`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
      ]);
    }
  }),

  ngayCapDuTuoi: (label: string) => ({
    validator: (_: any, value: any) =>
      runSequentialRules(value, [
        // rulesCheck.required(label),
        rulesCheck.noFutureDate(`${label} không được là ngày trong tương lai!`),
        rulesCheck.isAtLeast18Years(`${label} phải đủ 18 tuổi trở lên!`),
      ]),
  }),

  ngayCap: (label: string) => ({
    validator: (_: any, value: any) =>
      runSequentialRules(value, [
        // rulesCheck.required(label),
        rulesCheck.noFutureDate(`${label} không được là ngày trong tương lai!`),
        // rulesCheck.isAtLeast18Years(`${label} phải đủ 18 tuổi trở lên!`),
      ]),
  }),

  ngayBanHanh: (label: string) => ({
    validator: (_: any, value: any) =>
      runSequentialRules(value, [
        rulesCheck.required(label),
        // rulesCheck.noFutureDate(`${label} không được là ng ày trong tương lai!`),
        // rulesCheck.isAtLeast18Years(`${label} phải đủ 18 tuổi trở lên!`),
      ]),
  }),

  Fax: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue = (value !== undefined && value !== null) ? String(value) : "";
      return runSequentialRules(stringValue, [
        // rulesCheck.required(label),
        rulesCheck.isNumeric(`${label} chỉ được chứa chữ số!`),
        rulesCheck.isPhone(`${label} không đúng định dạng fax`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
      ]);
    }
  }),

  email: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue =
        value !== undefined && value !== null ? String(value) : "";

      return runSequentialRules(stringValue, [
        // rulesCheck.required(label),
        rulesCheck.noSpace(),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.max(label, 255),
        rulesCheck.isEmail(`${label} không đúng định dạng email!`),
      ]);
    },
  }),

  moTa: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [
        // rulesCheck.required(label),
        // rulesCheck.noNumber(`${label} không được chứa số!`),
        // rulesCheck.noSpecial(`${label} không được chứa ký tự đặc biệt!`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.noSpace(),
        // rulesCheck.max(label, 50),
      ]),
  }),

  maSoThue: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue =
        value !== undefined && value !== null ? String(value) : "";

      return runSequentialRules(stringValue, [
        // rulesCheck.required(label),
        rulesCheck.noSpace(),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.isTaxOrBusinessCode(),
      ]);
    },
  }),

  cccd: (label: string) => ({
    validator: (_: any, value: any) => {
      const stringValue = (value !== undefined && value !== null) ? String(value) : "";

      return runSequentialRules(stringValue, [
        // rulesCheck.required(label),
        rulesCheck.noSpace(),
        rulesCheck.isNumeric(`${label} chỉ được chứa chữ số!`),
        rulesCheck.noTripleSpace(`${label} không được nhập 3 khoảng trắng liên tiếp!`),
        rulesCheck.isCCCD(`${label} phải đúng 12 chữ số!`),
      ]);
    }
  }),
  noSpecial: (label: string) => ({
    validator: (_: any, value: string) =>
      runSequentialRules(value, [rulesCheck.noSpecial(`${label} không được chứa ký tự đặc biệt!`)]),
  }),
};
