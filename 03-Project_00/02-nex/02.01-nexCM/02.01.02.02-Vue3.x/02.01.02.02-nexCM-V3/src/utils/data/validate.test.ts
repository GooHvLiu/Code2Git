/**
 * ==========================================
 * validate.ts 单元测试
 * ==========================================
 * 覆盖用户名 / 密码 / 确认密码 / 邮箱校验器的正反例
 * i18n 实例在 jsdom 下随模块加载，错误消息从 common.validate.* 读取
 * 作者：GooHv
 */
import { describe, it, expect, vi } from 'vitest'
import { validateUsername, validatePassword, validateConfirmPassword, validateEmail } from './validate'

describe('validateUsername', () => {
  it('合法用户名（3-16 位）通过', () => {
    const cb = vi.fn()
    validateUsername({}, 'abc', cb)
    expect(cb).toHaveBeenCalledWith()
  })

  it('过短用户名失败', () => {
    const cb = vi.fn()
    validateUsername({}, 'ab', cb)
    expect(cb).toHaveBeenCalledTimes(1)
    const err = cb.mock.calls[0][0]
    expect(err).toBeInstanceOf(Error)
  })

  it('过长用户名失败', () => {
    const cb = vi.fn()
    validateUsername({}, 'a'.repeat(17), cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })

  it('空值失败', () => {
    const cb = vi.fn()
    validateUsername({}, '', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('validatePassword', () => {
  it('合法密码（6-20 位）通过', () => {
    const cb = vi.fn()
    validatePassword({}, '123456', cb)
    expect(cb).toHaveBeenCalledWith()
  })

  it('过短密码失败', () => {
    const cb = vi.fn()
    validatePassword({}, '12345', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })

  it('过长密码失败', () => {
    const cb = vi.fn()
    validatePassword({}, 'a'.repeat(21), cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('validateConfirmPassword', () => {
  it('两次密码一致通过', () => {
    const cb = vi.fn()
    validateConfirmPassword('secret123')({}, 'secret123', cb)
    expect(cb).toHaveBeenCalledWith()
  })

  it('两次密码不一致失败', () => {
    const cb = vi.fn()
    validateConfirmPassword('secret123')({}, 'other', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('validateEmail', () => {
  it('合法邮箱通过', () => {
    const cb = vi.fn()
    validateEmail({}, 'user@example.com', cb)
    expect(cb).toHaveBeenCalledWith()
  })

  it('带点/子域名的合法邮箱通过', () => {
    const cb = vi.fn()
    validateEmail({}, 'first.last@sub.domain.co.uk', cb)
    expect(cb).toHaveBeenCalledWith()
  })

  it('缺少 @ 失败', () => {
    const cb = vi.fn()
    validateEmail({}, 'userexample.com', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })

  it('缺少域名失败', () => {
    const cb = vi.fn()
    validateEmail({}, 'user@.com', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })

  it('空值失败', () => {
    const cb = vi.fn()
    validateEmail({}, '', cb)
    expect(cb).toHaveBeenCalledWith(expect.any(Error))
  })
})
