/**
 * @fileOverView mocha-order 关于it 和 hook之间的顺序
 * @author zhangmeng on 15/10/13
 */

describe('earth', function(){
    beforeEach(function(){
        console.log('see.. this function is run EACH time, before each describe()')
    })
    describe('singapre', function(){
        before(function () {
            console.log('it will happen before beforeEach and only once')
        })
        it('birds should fly', function(){ /** ... */ })
        it('horse should gallop', function(){ /** ... */ })
    })
    describe('malaysia', function(){
        it('birds should soar', function(){ /** ... */ })
    })
});


//earth
//singapre
//it will happen before beforeEach and only once
//see.. this function is run EACH time, before each describe()
//✓ birds should fly
//see.. this function is run EACH time, before each describe()
//✓ horse should gallop
//malaysia
//see.. this function is run EACH time, before each describe()
//✓ birds should soar
//
//
//3 passing (9ms)

