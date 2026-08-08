import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useToggleArray from '@/hooks/useToggleArray'

describe('useToggleArray', () => {
  it('adds a value that is not selected', () => {
    const { result } = renderHook(() => useToggleArray())
    act(() => result.current[1](3))
    expect(result.current[0]).toEqual([3])
  })

  it('removes a value that is already selected', () => {
    const { result } = renderHook(() => useToggleArray([1, 2]))
    act(() => result.current[1](1))
    expect(result.current[0]).toEqual([2])
  })

  it('accumulates multiple selections', () => {
    const { result } = renderHook(() => useToggleArray())
    act(() => result.current[1](1))
    act(() => result.current[1](2))
    expect(result.current[0]).toEqual([1, 2])
  })

  it('clears every selection', () => {
    const { result } = renderHook(() => useToggleArray([1, 2, 3]))
    act(() => result.current[2]())
    expect(result.current[0]).toEqual([])
  })
})
