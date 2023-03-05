import { ConflictException, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "../auth.service"

const usersRepository: any = jest.fn()
const jwtService: any = jest.fn()

describe('authService', () => {
  describe('signUp', () => {
    it('should not create the user because found with same email', async () => {
        const service = new AuthService(usersRepository, jwtService)

        usersRepository.findOne = jest.fn().mockResolvedValueOnce({
          id: 1,
        })

        const error = new ConflictException('Email already exists')

        expect(async () => await service.signUp({
          email: 'test@test.com',
          name: 'test',
          password: 'test'
        })).rejects.toThrow(error)
    })

    it('should create the user because not found with same email', async () => {
        const service = new AuthService(usersRepository, jwtService)

        usersRepository.findOne = jest.fn().mockResolvedValueOnce(undefined)

        usersRepository.save = jest.fn().mockResolvedValueOnce({ id: 1 })

        expect(await service.signUp({
          email: 'test@test.com',
          name: 'test',
          password: 'test'
        })).toEqual(undefined);
    })
  })

  describe('signIn',  () => {
    it('should not signIp because user not found', async () => {
        const service = new AuthService(usersRepository, jwtService)

        usersRepository.findOne = jest.fn().mockResolvedValueOnce(undefined)

        const error = new UnauthorizedException('Please check your login credentials');

        expect(async () => await service.signIn({
          email: 'test@test.com',
          password: 'test'
        })).rejects.toThrow(error);
    })
  })
})
