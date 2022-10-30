$(document).ready(function()
{
        
    //    $('#states').empty()
       $('#states').append($('<option>').text("-Select State-"))

        $.getJSON('/marksheet/getstates',function(data)
        {
            $.each(data,function(index,item)
            { 
                
                $('#states').append($('<option>').text(item.states).val(item.stateid))

            })

        })


    function fillCities(stateid)
    {
        $('#cities').empty()
        $('#cities').append($('<option>').text("-Select City-"))

        $.getJSON('/marksheet/getcities',{'stateid':stateid},function(data)
        {

            $.each(data,function(index,item)
            { 
                $('#cities').append($('<option>').text(item.cities).val(item.cityid))



            })

        })
    }

    $('#states').change(function()
    {

        fillCities($("#states").val())



    })
  




})