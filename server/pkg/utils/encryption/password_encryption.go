package encryption

import (
	"golang.org/x/crypto/bcrypt"
)

type Encryptor interface {
	Encrypt(str string) (string, error)
	Compare(hash, plainPassword string) error
}

type bcryptEncoder struct {
	cost int
}

func NewBcryptEncoder(cost int) Encryptor {
	return bcryptEncoder{
		cost: cost,
	}
}

func (en bcryptEncoder) Encrypt(pass string) (string, error) {
	enPass, err := bcrypt.GenerateFromPassword(
		[]byte(pass),
		en.cost,
	)

	if err != nil {
		return "", err
	}

	return string(enPass), nil
}

func (en bcryptEncoder) Compare(hash, pass string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass))
	return err
}
