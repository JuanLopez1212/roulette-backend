const RED_NUMBERS = new Set([ 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 ])

function spinWheel() {
    const winningNumber = Math.floor( Math.random() * 37 )
    let winningColor = 'verde'
    if ( winningNumber === 0 ) {
        winningColor = 'verde'
    }
    else {
        winningColor = RED_NUMBERS.has(winningNumber) ? 'rojo' : 'negro'
        return { winningNumber, winningColor }
    }
}

function calculatePayoutForBets ( betsArray, winningNumber, winningColor ) {
    let payout = 0
    for ( const b of betsArray ) {
        if ( b.type === 'numero' ) {
            if ( Number( b.value ) === Number( winningNumber ) ) {
                payout += b.amount * 35
            }
        }
        else if ( b.type === 'color' ) {
            if ( String( b.value ).toLowerCase() === String( winningColor).toLowerCase()) {
                payout += b.amount * 1
            }
        }
    }
    return payout 
}

export {
    spinWheel,
    calculatePayoutForBets
}