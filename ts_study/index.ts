import fs from 'fs' // 必须得使用esModuleInterop,使用非es的话会报错，因为fs导出的时候使用的不是export default
// 或者使用 import { readFileSync } from 'fs'