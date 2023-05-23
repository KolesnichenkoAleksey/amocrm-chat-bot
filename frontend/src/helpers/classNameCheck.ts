function classNameCheck (...cls: (string | undefined)[]) {
    return cls.reduce((res: string, item: string | undefined) => res += item ? item + ' ' : '', '')
}
export default classNameCheck