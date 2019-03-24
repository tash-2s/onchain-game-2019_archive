pragma solidity 0.4.24;

contract PermanenceInterpretable {
  // ex) (123456789, 4, 6) => 456
  function interpretPermanenceUint256(uint256 target, uint256 startDigit, uint256 endDigit)
    public
    pure
    returns (uint256)
  {
    assertInterpretableDigits(startDigit, endDigit);

    return target % (10 ** endDigit) / (10 ** (startDigit - 1));
  }

  // ex) (123456789, 4, 6, 999) => 123999789
  function reinterpretPermanenceUint256(
    uint256 target,
    uint256 startDigit,
    uint256 endDigit,
    uint256 update
  ) public pure returns (uint256) {
    assertInterpretableDigits(startDigit, endDigit);

    uint256 zeroFilledTarget = (target / (10 ** endDigit) * (10 ** endDigit)) + (target % (10 ** (startDigit - 1)));
    uint256 uppedUpdate = update * (10 ** (startDigit - 1));

    return zeroFilledTarget + uppedUpdate;
  }

  function assertInterpretableDigits(uint256 startDigit, uint256 endDigit) public pure {
    require(startDigit <= endDigit, "wrong digits");
  }
}
